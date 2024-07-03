export const unSlugify = (slug) => {
    return slug
        .replace(/-/g, ' ')
        .split(' ')
        // .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}