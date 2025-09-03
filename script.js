// Populate versions dropdown (1.8.9 → 1.21.8)
document.addEventListener("DOMContentLoaded", () => {
  const versionSelect = document.getElementById("serverVersion");
  if (versionSelect) {
    const versions = generateVersions("1.8.9", "1.21.8");
    versions.forEach(v => {
      const option = document.createElement("option");
      option.value = v;
      option.textContent = v;
      versionSelect.appendChild(option);
    });
  }

  // Handle mc.html form submission
  const form = document.getElementById("serverForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("serverName").value;
      const software = document.getElementById("serverSoftware").value;
      const version = document.getElementById("serverVersion").value;

      localStorage.setItem("serverName", name);
      localStorage.setItem("serverSoftware", software);
      localStorage.setItem("serverVersion", version);

      window.location.href = "panel.html";
    });
  }

  // Handle panel.html server start
  const startBtn = document.getElementById("startServer");
  if (startBtn) {
    const name = localStorage.getItem("serverName");
    const software = localStorage.getItem("serverSoftware");
    const version = localStorage.getItem("serverVersion");

    document.getElementById("serverDetails").textContent =
      `Server: ${name}, Software: ${software}, Version: ${version}`;

    startBtn.addEventListener("click", () => {
      fetch("https://api.github.com/repos/lunarhost520/lunarhost-server/actions/workflows/server.yml/dispatches", {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": "Bearer YOUR_GITHUB_TOKEN"
        },
        body: JSON.stringify({
          ref: "main",
          inputs: {
            server_name: name,
            server_version: version,
            server_software: software
          }
        })
      }).then(res => {
        if (res.ok) {
          alert("Server starting via GitHub Actions...");
        } else {
          alert("Failed to start server.");
        }
      });
    });
  }
});

// Helper: Generate versions between two Minecraft versions
function generateVersions(start, end) {
  const versions = [];
  const [startMajor, startMinor, startPatch] = start.split(".").map(Number);
  const [endMajor, endMinor, endPatch] = end.split(".").map(Number);

  for (let major = startMajor; major <= endMajor; major++) {
    const minorStart = (major === startMajor) ? startMinor : 0;
    const minorEnd = (major === endMajor) ? endMinor : 99;

    for (let minor = minorStart; minor <= minorEnd; minor++) {
      let patchStart = (major === startMajor && minor === startMinor) ? startPatch : 0;
      let patchEnd = (major === endMajor && minor === endMinor) ? endPatch : 20;

      for (let patch = patchStart; patch <= patchEnd; patch++) {
        versions.push(`${major}.${minor}.${patch}`);
      }
    }
  }
  return versions;
}
