#!/bin/bash

# Define the GitHub repository URL
repositoryURL="https://api.github.com/repos/freegamerskids/ChasBot"

# Get the latest release information from the GitHub API
latestReleaseURL="$repositoryURL/releases/latest"
latestZipURL=$(curl -sSL "$latestReleaseURL" | grep -o 'browser_download_url":"[^"]*' | grep "update.zip" | cut -d'"' -f4)

# Download the latest release zip file
zipFilePath=$(mktemp)
curl -L "$latestZipURL" -o "$zipFilePath"

# Unpack the zip file to the current directory (replace existing files)
unzip -o "$zipFilePath"

# Remove the temporary zip file
rm "$zipFilePath"
