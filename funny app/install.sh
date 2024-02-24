echo "Installing the Funny App.."
draw_progress_bar() {
    local percentage=$1
    local total_length=50
    local bar_length=$((percentage * total_length / 100))

    printf "["
    for ((i=0; i<bar_length; i++)); do printf "#"; done
    for ((i=0; i<((total_length - bar_length)); i++)); do printf " "; done
    printf "] %d%%\r" "$percentage"
}

# Create directory if it doesn't exist
mkdir -p "$HOME/JJJ/all-store/jacko-funnyapp"

# Example commands
echo "Creating a shortcut..."
total_iterations=50
for ((i=1; i<=total_iterations; i++)); do
    sleep 0.1
    progress=$((i * 100 / total_iterations))
    draw_progress_bar "$progress"
    shortcut_file="$HOME/Desktop/MyApp.desktop"
    cat > "$shortcut_file" <<EOF
[Desktop Entry]
Version=1.0
Name=MyApp
Exec=/bin/bash -c "~/JJJ/all-store/jacko-funnyapp/start.sh"
Icon=/path/to/icon.png
Terminal=false
Type=Application
EOF
done
echo ""
echo "Extracting files.."
tar -xvf app.tar.xz -C "$HOME/JJJ/all-store/jacko-funnyapp" > /dev/null

echo "Installation Complete."
