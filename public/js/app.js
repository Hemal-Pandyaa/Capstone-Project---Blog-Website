$("#blogTitle").on("input", () => {
    adjustTextAreaHeight($("#blogTitle"));
});

$("#blogAbout").on("input", () => {
    adjustTextAreaHeight($("#blogAbout"));
});

$("#blog").on("input", () => {
    adjustTextAreaHeight($("#blog"));
});

$("#message").on("input", () => {
    adjustTextAreaHeight($("#message"));
});

function adjustTextAreaHeight($textarea) {
    $textarea.css("height", "auto");
    let height = $textarea[0].scrollHeight;
    $textarea.height(height);
}

function request(url, type) {
    return fetch(url,{
        method:type});
}
function deleteBlog(id, redirect){
    const url = "/myBlogs/delete/" + id + "/"
    request(url, "DELETE").then(response => {
        if(response.ok) {
            window.location.href ="/myBlogs";
        }
    });
    if(redirect) window.location.href = "/"
}


function editBlog(id) {
    fetch("/myBlogs/edit/" + id, {
        method: "PUT"
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            console.error("Error while editing blog");
        }
    })
    .then(html => {
        // Replace the content of the current page with the received HTML
        document.body.innerHTML = html;
    })
    .catch(error => console.error(error));
}
