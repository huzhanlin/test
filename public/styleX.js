{
    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;

    let mediaNum = 0
    if (width > height) {
        mediaNum = height / 16
    } else {
        mediaNum = width / 16
    }
    let styleN = document.createElement("style");
    styleN.innerHTML = "html{font-size:" + mediaNum + "px!important}";
    document.head.appendChild(styleN);
}


