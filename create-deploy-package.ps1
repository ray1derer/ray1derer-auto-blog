# PowerShell script to create deployment package
$excludes = @(
    "node_modules",
    ".git",
    ".next",
    "*.tar.gz",
    "*.log",
    ".env.local",
    "temp_page.txt",
    "dev.log"
)

$tempDir = "deploy-temp"
$outputFile = "ray1derer-auto-blog-deploy.tar.gz"

# Create temp directory
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir

# Copy files
$files = Get-ChildItem -Path . -Exclude $excludes
foreach ($file in $files) {
    if ($file.Name -notlike "*.tar.gz" -and $file.Name -ne $tempDir) {
        Copy-Item $file.FullName -Destination $tempDir -Recurse
    }
}

# Create tar.gz
tar -czf $outputFile -C $tempDir .

# Clean up
Remove-Item $tempDir -Recurse -Force

Write-Host "Deployment package created: $outputFile"