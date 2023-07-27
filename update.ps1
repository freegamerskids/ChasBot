# Define the GitHub repository URL
$repositoryURL = "https://api.github.com/repos/freegamerskids/ChasBot"

# Get the latest release information from the GitHub API
$latestReleaseURL = "$repositoryURL/releases/latest"
$response = Invoke-WebRequest -Uri $latestReleaseURL
$releaseInfo = $response.Content | ConvertFrom-Json
$latestZipURL = $releaseInfo.assets | Where-Object { $_.name -eq "update.zip" } | Select-Object -ExpandProperty browser_download_url

# Download the latest release zip file
$zipFilePath = Join-Path $env:TEMP "update.zip"
Invoke-WebRequest -Uri $latestZipURL -OutFile $zipFilePath

# Unpack the zip file to the current directory (replace existing files)
Expand-Archive -Path $zipFilePath -DestinationPath $PWD -Force

# Remove the temporary zip file
Remove-Item -Path $zipFilePath
