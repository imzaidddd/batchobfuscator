document.getElementById('batchForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const fileContent = event.target.result;
    
    // Base64 encode the file content (simulating certutil decode)
    const base64Encoded = btoa(fileContent);
    
    // Simulate the creation of a new obfuscated file content
    const obfuscatedContent = `
      @echo off
      if "%~1"=="" exit /b
      if /i "%~x1" neq ".bat" if /i "%~x1" neq ".cmd" exit /b
      for /f %%i in ("certutil.exe") do if not exist "%%~$path:i" (
        echo CertUtil.exe not found.
        pause
        exit /b
      )
      >"temp.~b64" echo(${base64Encoded}
      certutil.exe -f -decode "temp.~b64" "%~n1___%~x1"
      del "temp.~b64"
      copy "%~n1___%~x1" /b + "%~1" /b
    `;

    // Display the obfuscated code
    document.getElementById('obfuscatedCode').value = obfuscatedContent;
    document.getElementById('result').style.display = 'block';

    // Enable download
    document.getElementById('downloadButton').addEventListener('click', function() {
      const blob = new Blob([obfuscatedContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'obfuscated_batch.bat';
      link.click();
    });
  };

  reader.readAsText(file);
});
