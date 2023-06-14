// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose, Engine as _};
use id3::{Tag, TagLike};
use mp3_duration;
use serde::{Deserialize, Serialize};
use std::error::Error;
use tauri::{App, Manager};

#[derive(Serialize)]
struct Track {
    source: String,
    title: Option<String>,
    artist: Option<String>,
    album: Option<String>,
    album_track: Option<String>,
    album_art: Option<String>,
    duration: Option<u128>,
    genre: Option<String>,
    year: Option<String>,
    lyrics: Option<Vec<LyricsItem>>,
}

#[derive(Serialize, Deserialize)]
struct FileEntry {
    path: String,
    children: Option<Vec<FileEntry>>,
}

#[derive(Serialize, Deserialize)]
struct LyricsItem {
    text: String,
    description: String,
    lang: String,
}

#[tauri::command]
fn get_audio_files_from_folder(entries: Vec<FileEntry>, batch_size: usize) -> Vec<Track> {
    let mut tracks: Vec<Track> = Vec::new();
    let mut batch: Vec<Track> = Vec::new();

    for entry in entries {
        if is_audio(&entry.path) {
            if let Some(metadata) = get_metadata(&entry.path) {
                batch.push(metadata);
            }
        }

        if let Some(children) = entry.children {
            let child_tracks: Vec<Track> = get_audio_files_from_folder(children, batch_size);
            batch.extend(child_tracks);
        }

        if batch.len() >= batch_size {
            tracks.append(&mut batch);
        }
    }
    tracks.append(&mut batch);
    tracks
}

#[tauri::command]
fn is_audio(source: &str) -> bool {
    let extension: Option<String> = source.split('.').last().map(|ext: &str| ext.to_lowercase());
    matches!(extension.as_deref(), Some("mp3") | Some("flac"))
}

#[tauri::command]
fn get_metadata(source: &str) -> Option<Track> {
    if let (Ok(tag), Ok(duration)) = (Tag::read_from_path(source), mp3_duration::from_path(source))
    {
        let album_track: Option<&str> = tag
            .get("TRCK")
            .and_then(|frame: &id3::Frame| frame.content().text());
        let year: Option<&str> = tag
            .get("TDRC")
            .and_then(|frame: &id3::Frame| frame.content().text());
        let lyrics: Vec<LyricsItem> = tag
            .lyrics()
            .into_iter()
            .map(|frame: &id3::frame::Lyrics| LyricsItem {
                text: frame.text.to_owned(),
                description: frame.description.to_owned(),
                lang: frame.lang.to_owned(),
            })
            .collect();

        Some(Track {
            source: String::from(source),
            title: to_owned_string(tag.title()),
            artist: to_owned_string(tag.artist()),
            album: to_owned_string(tag.album()),
            album_track: to_owned_string(album_track),
            album_art: tag.pictures().next().map(|p: &id3::frame::Picture| {
                let mut str: String = String::from("data:");
                str.push_str(&p.mime_type);
                str.push_str(";base64, ");
                let base64_str: String = general_purpose::STANDARD_NO_PAD.encode(&p.data);
                str.push_str(&base64_str);
                str
            }),
            duration: Some(duration.as_millis()),
            genre: to_owned_string(tag.genre()),
            year: to_owned_string(year),
            lyrics: Some(lyrics),
        })
    } else {
        None
    }
}

fn to_owned_string(var: Option<&str>) -> Option<String> {
    var.map(|s: &str| s.to_owned())
        .or_else(|| Some(String::from("None")))
}

fn handle_setup(app: &mut App) -> Result<(), Box<dyn Error>> {
    let window = app.get_window("main").unwrap();

    use window_vibrancy::apply_blur;

    #[cfg(target_os = "windows")]
    apply_blur(&window, None)
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(handle_setup)
        .invoke_handler(tauri::generate_handler![
            get_metadata,
            get_audio_files_from_folder
        ])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
