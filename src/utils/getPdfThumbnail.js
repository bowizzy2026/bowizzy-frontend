export function getPdfThumbnail(url, width = 300, height = 400) {
    return url.replace(
        "/upload/",
        `/upload/pg_1,w_${width},h_${height},c_fill,f_jpg/`
    );
}