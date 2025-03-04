export const MapPreview = ({latitude, longitude}: { latitude: string; longitude: string }) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
        return null;
    }

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
        <div className="w-full mt-4" style={{height: '200px'}}>
            <iframe
                title="Location Map"
                width="100%"
                height="100%"
                style={{border: 0}}
                src={mapUrl}
                allowFullScreen
            />
        </div>
    );
};