// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;
use tauri::{App, Manager};

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
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
