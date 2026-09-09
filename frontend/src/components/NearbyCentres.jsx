import { useState } from "react";
import { MapPin, Building2, Navigation, Search, RefreshCw, Map, CheckCircle2, AlertCircle } from "lucide-react";
import { getNearbyCentres } from "../api/centreApi";

function NearbyCentres() {
    const [centres, setCentres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedCentre, setSelectedCentre] = useState(null);

    const findNearbyCentres = () => {
        setLoading(true);
        setError("");
        setSelectedCentre(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("Farmer Latitude:", latitude);
                console.log("Farmer Longitude:", longitude);

                try {
                    const data = await getNearbyCentres(
                        latitude,
                        longitude
                    );

                   console.log(
    "Distances received by frontend:",
    data.map((centre) => ({
        id: centre.id,
        name: centre.name,
        latitude: centre.latitude,
        longitude: centre.longitude,
        distanceKm: centre.distanceKm
    }))
);

                    setCentres(data);
                } catch (error) {
                    console.error("Nearby centre error:", error);
                    setError(
                        "Unable to fetch nearby procurement centres."
                    );
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Location error:", error);

                setError(
                    "Please allow location access to find nearby centres."
                );

                setLoading(false);
            }
        );
    };

    const handleSelectCentre = (centre) => {
        setSelectedCentre(centre);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">

            {/* Header */}
            <div className="border-b border-green-100 bg-white/90 backdrop-blur">
                <div className="mx-auto max-w-7xl px-6 py-8">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                    <MapPin className="h-5 w-5 text-green-700" />
                                </div>

                                <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
                                    SmartProcure
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                                Nearby Procurement Centres
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
                                Find procurement centres near your current
                                location and choose the most convenient
                                centre for your crop procurement.
                            </p>
                        </div>

                        <div className="hidden rounded-2xl bg-green-50 px-5 py-4 md:block">
                            <div className="flex items-center gap-3">
                                <Navigation className="h-5 w-5 text-green-700" />

                                <div>
                                    <p className="text-xs font-medium text-gray-500">
                                        Location service
                                    </p>

                                    <p className="text-sm font-semibold text-green-700">
                                        Ready to detect
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* Location Search Card */}
                <div className="mb-8 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">

                    <div className="p-6 md:p-8">

                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                                    <Navigation className="h-6 w-6 text-green-700" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Find centres near you
                                    </h2>

                                    <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                                        We will use your current location to
                                        calculate the nearest procurement
                                        centres.
                                    </p>
                                </div>

                            </div>

                            <button
                                onClick={findNearbyCentres}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Finding Centres...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-4 w-4" />
                                        Find Nearby Centres
                                    </>
                                )}
                            </button>

                        </div>

                        {/* Location detected message */}
                        {!loading && centres.length > 0 && !error && (
                            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />

                                <div>
                                    <p className="text-sm font-semibold text-green-800">
                                        Location detected successfully
                                    </p>

                                    <p className="text-xs text-green-700">
                                        Showing procurement centres based on
                                        your current location.
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                        <div>
                            <p className="font-semibold text-red-800">
                                Location Error
                            </p>

                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-5 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-gray-200" />

                                    <div className="flex-1">
                                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                                        <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-3 rounded bg-gray-200" />
                                    <div className="h-3 w-5/6 rounded bg-gray-200" />
                                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                                </div>

                                <div className="mt-6 h-10 rounded-xl bg-gray-200" />
                            </div>
                        ))}

                    </div>
                )}

                {/* Results */}
                {!loading && centres.length > 0 && (
                    <section>

                        <div className="mb-5 flex items-end justify-between">

                            <div>
                                <p className="text-sm font-semibold text-green-700">
                                    PROCUREMENT CENTRES
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                                    Nearest Centres
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select a centre that is convenient for you.
                                </p>
                            </div>

                            <div className="hidden rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 sm:block">
                                {centres.length} Centres Found
                            </div>

                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {centres.map((centre, index) => {

                                const isNearest = index === 0;

                                const isSelected =
                                    selectedCentre?.id === centre.id;

                                return (
                                    <div
                                        key={centre.id}
                                        className={`relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                                            isSelected
                                                ? "border-green-500 ring-2 ring-green-100"
                                                : "border-gray-100"
                                        }`}
                                    >

                                        {/* Recommended badge */}
                                        {isNearest && (
                                            <div className="absolute right-4 top-4 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                ⭐ Recommended
                                            </div>
                                        )}

                                        {/* Centre heading */}
                                        <div className="mb-5 flex items-start gap-4 pr-20">

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                                                <Building2 className="h-6 w-6 text-green-700" />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold leading-6 text-gray-900">
                                                    {centre.name}
                                                </h3>

                                                <p className="mt-1 text-xs font-medium text-gray-500">
                                                    Centre Code: {centre.code}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Distance */}
                                        <div className="mb-5 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3">

                                            <MapPin className="h-5 w-5 text-green-600" />

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Distance from you
                                                </p>

                                                <p className="text-sm font-bold text-gray-900">
                                                    {Number(centre.distanceKm).toFixed(2)} km
                                                </p>
                                            </div>

                                        </div>

                                        {/* Address */}
                                        <div className="space-y-3">

                                            <div className="flex items-start gap-3">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                                                <div>
                                                    <p className="text-xs font-medium text-gray-400">
                                                        Address
                                                    </p>

                                                    <p className="mt-0.5 text-sm leading-5 text-gray-700">
                                                        {centre.address}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                                                <div>
                                                    <p className="text-xs font-medium text-gray-400">
                                                        Location
                                                    </p>

                                                    <p className="mt-0.5 text-sm text-gray-700">
                                                        {centre.village},{" "}
                                                        {centre.block}
                                                    </p>

                                                    <p className="text-sm text-gray-700">
                                                        {centre.district},{" "}
                                                        {centre.state}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Buttons */}
                                        <div className="mt-6 flex gap-3">

                                            <button
                                                onClick={() =>
                                                    handleSelectCentre(centre)
                                                }
                                                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                                    isSelected
                                                        ? "bg-green-700 text-white"
                                                        : "bg-green-50 text-green-700 hover:bg-green-100"
                                                }`}
                                            >
                                                {isSelected
                                                    ? "✓ Selected"
                                                    : "Select Centre"}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    window.open(
                                                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                            `${centre.address}, ${centre.village}, ${centre.district}, ${centre.state}`
                                                        )}`,
                                                        "_blank"
                                                    )
                                                }
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                                                title="View on map"
                                            >
                                                <Map className="h-4 w-4" />
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    </section>
                )}

                {/* No results */}
                {!loading && !error && centres.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-green-200 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                            <MapPin className="h-8 w-8 text-green-700" />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            Find your nearest procurement centre
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Allow location access and click the button above
                            to discover procurement centres near you.
                        </p>

                        <button
                            onClick={findNearbyCentres}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                        >
                            <Navigation className="h-4 w-4" />
                            Detect My Location
                        </button>

                    </div>
                )}

                {/* Selected centre */}
                {selectedCentre && (
                    <div className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-6">

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                                        Selected Centre
                                    </p>

                                    <h3 className="mt-1 text-xl font-bold text-gray-900">
                                        {selectedCentre.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Centre Code: {selectedCentre.code}
                                    </p>
                                </div>

                            </div>

                            <button
                                onClick={() =>
                                    window.location.href = "/slot-booking"
                                }
                                className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                            >
                                Continue to Slot Booking
                            </button>

                        </div>

                    </div>
                )}

            </main>
        </div>
    );
}

export default NearbyCentres;