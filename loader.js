const fileInput = document.getElementById("keyproFile");

const status = document.getElementById("status");

const result = document.getElementById("result");

const projectName = document.getElementById("projectName");
const version = document.getElementById("version");
const keyElement = document.getElementById("key");
const effect = document.getElementById("effect");


fileInput.addEventListener("change", async () => {

  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  status.textContent = "📦 KeyProを読み込んでいます...";

  try {

    const zip = await JSZip.loadAsync(file);

    // 必須ファイル確認
    const requiredFiles = [
      "README.md",
      "is-a-key",
      "package.json",
      "extensions.js",
      "hereisthekey.txt"
    ];

    for (const filename of requiredFiles) {

      if (!zip.file(filename)) {

        throw new Error(
          `${filename} がありません。`
        );

      }

    }

    // is-a-key確認
    const marker =
      await zip.file("is-a-key").async("text");

    if (!marker.includes("KeyPro")) {

      throw new Error(
        "KeyPro Key Projectではありません。"
      );

    }

    // package.json
    const packageText =
      await zip.file("package.json").async("text");

    const packageData =
      JSON.parse(packageText);

    // Key取得
    const keyText =
      await zip.file("hereisthekey.txt").async("text");

    const match =
      keyText.match(/Key is\s+([^\s]+)/);

    if (!match) {

      throw new Error(
        "Keyを見つけられませんでした。"
      );

    }

    const key = match[1];

    // extensions.js
    const extensions =
      await zip.file("extensions.js").async("text");

    status.textContent =
      "✅ KeyProの読み込みに成功しました！";

    result.hidden = false;

    projectName.textContent =
      `Project: ${packageData.name}`;

    version.textContent =
      `Version: ${packageData.version}`;

    keyElement.textContent =
      key;

    if (extensions.includes(key)) {

      effect.textContent =
        "🎨 このKeyに対応した拡張機能があります。";

    } else {

      effect.textContent =
        "このKeyに対応する拡張機能はありません。";

    }

  } catch (error) {

    status.textContent =
      `❌ 読み込みエラー: ${error.message}`;

    result.hidden = true;

  }

});
