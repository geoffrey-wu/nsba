if (location.protocol === 'http:' && location.hostname !== 'localhost') {
    location.protocol = 'https:';
}