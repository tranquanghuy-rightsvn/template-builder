window.download = async function(){
  var zip = new JSZip();
  const website = JSON.parse(localStorage.getItem('website'));
  let content_html = ""
  let styleCssContent = ""
  const current_library = await get_current_library();
  for (const ele of website) {
    try {
      const componentData = await fetch(`./components/${current_library.folder_path}/${ele.name}/${ele.variant}.json`)
        .then(response => response.json());
      content_html += componentData.html;
      styleCssContent += componentData.css;
    } catch (error) {
      console.error('There is an error has occured:', error);
    }
  }
  var indexHtmlContent = `
      <!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My website</title>
        <link href=${current_library.cdnCss} rel="stylesheet">

        <link rel="stylesheet" href="./style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </head>
      <body>
        `
        + content_html +
        `
      </body>
      <script src=${current_library.cdnJs}></script>
      </html>
  `;
  zip.file("index.html", html_beautify(indexHtmlContent));
  zip.file("style.css", styleCssContent);
  zip.generateAsync({ type: "blob" }).then(function(content) {
    var link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "MyWebsite.zip";
    link.click();
  });
}
