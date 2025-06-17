const FILE_EXTENSIONS_MAP = {
    'image/jpeg': 'jpg',
    'image/pjpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/avif': 'avif',
}

/**
 * 
 * @param {File} file 
 * @return {string}
 */
export function getFileExtension(file) {
    return FILE_EXTENSIONS_MAP[file.type] || '';

    /*switch(file.type) {
        case 'image/jpeg':
        case 'image/pjpeg':
            return 'jpg';
        
        case 'image/png':
            return 'png';
        
        case 'image/gif':
            return 'gif';
        
        case 'image/webp':
            return 'webp';
        
        case 'image/avif':
            return 'avif';

        default:
            return '';
    }*/
}