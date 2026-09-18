<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

        <title inertia>{{ config('app.name', 'PHANSITE — Persona 5 Portfolio | Bimasena') }}</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="PHANSITE: An interactive Persona 5 Royal inspired developer portfolio and metaverse platform by Bimasena. Featuring full-stack web applications, reactive architecture, and Neo-Brutalist UI/UX.">
        <meta name="keywords" content="Persona 5 Portfolio, Persona 5 Portofolio, Persona 5 Website, Phansite, Phantom Thieves Portfolio, Bimasena Portfolio, Persona 5 Web, Full Stack Developer, Neo-Brutalist Web Design">
        <meta name="author" content="Bimasena">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Open Graph / Facebook / Discord / LinkedIn -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:site_name" content="PHANSITE // Phantom Aficionado">
        <meta property="og:title" content="PHANSITE — Persona 5 Portfolio | Bimasena">
        <meta property="og:description" content="PHANSITE: An interactive Persona 5 Royal inspired developer portfolio by Bimasena. Stealing hearts with high-performance web applications and bespoke reactive UI.">
        <meta property="og:image" content="{{ asset('assets/img/1_27_overview.webp') }}">

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ url()->current() }}">
        <meta name="twitter:title" content="PHANSITE — Persona 5 Portfolio | Bimasena">
        <meta name="twitter:description" content="PHANSITE: An interactive Persona 5 Royal inspired developer portfolio by Bimasena. Stealing hearts with high-performance web applications and bespoke reactive UI.">
        <meta name="twitter:image" content="{{ asset('assets/img/1_27_overview.webp') }}">

        <!-- Schema.org JSON-LD Structured Data for Google -->
        <script type="application/ld+json">
        {!! json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => 'Bimasena',
            'alternateName' => 'Phantom Aficionado',
            'url' => url('/'),
            'jobTitle' => 'Full-Stack Developer',
            'description' => 'Creator of PHANSITE — an interactive Persona 5 Royal inspired developer portfolio showcasing high-performance web applications.',
            'knowsAbout' => [
                'Full-Stack Web Development',
                'Laravel',
                'React',
                'Inertia.js',
                'Persona 5 UI/UX Design',
                'Neo-Brutalism',
            ],
        ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
        </script>

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
