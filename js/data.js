// Catálogo de Filmes
const movieCatalog = {
    trending: [
        {
            id: 'anonimo2',
            title: 'Anônimo 2',
            poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
            year: '2025',
            duration: '2h 15min',
            rating: '16',
            genre: ['Ação', 'Thriller', 'Crime'],
            description: 'Um thriller de ação sobre hackers que lutam contra a corrupção governamental em uma batalha épica pela verdade e justiça.',
            embedUrl: 'https://filemoon.to/e/saaei4d1dy5k/Anonimo_2_2025_720p_Dub_Filmesmp4_vip',
            isNew: true
        },
        {
            id: 'caras_malvados',
            title: 'Os Caras Malvados',
            poster: 'https://img-place.com/o2htrtsbx4yb_t.jpg',
            year: '2022',
            duration: '1h 40min',
            rating: 'L',
            embedUrl: 'https://filemoon.to/e/o2htrtsbx4yb/OSCRSMLVDS2'
        },
        {
            id: 'spider_verse',
            title: 'Homem-Aranha: Através do Aranhaverso',
            poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
            year: '2023',
            duration: '2h 20min',
            rating: '12'
        },
        {
            id: 'elio_2025',
            title: 'Elio',
            poster: 'https://m.media-amazon.com/images/S/pv-target-images/7be4f64e7489bbc8c57bcfc35644b115091fcb13e78bf92e02194dbc89a42775.jpg',
            year: '2025',
            duration: '1h 38min',
            rating: 'L',
            genre: ['Animação', 'Aventura', 'Família'],
            description: 'Um jovem de 11 anos que sonha em ser astronauta acidentalmente se torna o embaixador intergaláctico da Terra.',
            embedUrl: 'https://filemoon.to/e/re3usn6ljot2/Elio_2025_WEB-DL_1080p_DUAL_5_1',
            isNew: true
        },
        {
            id: 'oppenheimer',
            title: 'Oppenheimer',
            poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
            year: '2023',
            duration: '3h',
            rating: '14'
        },
        {
            id: 'barbie',
            title: 'Barbie',
            poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
            year: '2023',
            duration: '1h 54min',
            rating: '12'
        },
        {
            id: 'guardians3',
            title: 'Guardiões da Galáxia Vol. 3',
            poster: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
            year: '2023',
            duration: '2h 30min',
            rating: '12'
        },
        {
            id: 'johnwick4',
            title: 'John Wick 4: Baba Yaga',
            poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
            year: '2023',
            duration: '2h 49min',
            rating: '16'
        },
        {
            id: 'minions2',
            title: 'Minions 2: A Origem de Gru',
            poster: 'https://img-place.com/pl6ne06aubag_t.jpg',
            year: '2022',
            duration: '1h 27min',
            rating: 'L',
            genre: ['Animação', 'Comédia', 'Família'],
            description: 'Gru e os Minions estão de volta! Descubra a origem do vilão mais querido do cinema em uma aventura hilariante.',
            embedUrl: 'https://filemoon.to/e/pl6ne06aubag/Minions_2_-_A_Origem_de_Gru_2022_1080p_WEB-DL_DUAL_5_1'
        }
    ],
    
    action: [
        {
            id: 'anonimo2_action',
            title: 'Anônimo 2',
            poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
            year: '2025',
            duration: '2h 15min',
            rating: '16',
            genre: ['Ação', 'Thriller', 'Crime'],
            description: 'Um thriller de ação sobre hackers que lutam contra a corrupção governamental em uma batalha épica pela verdade e justiça.',
            embedUrl: 'https://filemoon.to/e/saaei4d1dy5k/Anonimo_2_2025_720p_Dub_Filmesmp4_vip',
            isNew: true
        },
        {
            id: 'elio_2025',
            title: 'Elio',
            poster: 'https://m.media-amazon.com/images/S/pv-target-images/7be4f64e7489bbc8c57bcfc35644b115091fcb13e78bf92e02194dbc89a42775.jpg',
            year: '2025',
            duration: '1h 38min',
            rating: 'L',
            genre: ['Animação', 'Aventura', 'Família'],
            description: 'Um jovem de 11 anos que sonha em ser astronauta acidentalmente se torna o embaixador intergaláctico da Terra.',
            embedUrl: 'https://filemoon.to/e/re3usn6ljot2/Elio_2025_WEB-DL_1080p_DUAL_5_1',
            isNew: true
        },
        {
            id: 'john_wick',
            title: 'John Wick 4: Baba Yaga',
            poster: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
            year: '2023',
            duration: '2h 49min',
            rating: '16'
        },
        {
            id: 'fast_x',
            title: 'Velozes & Furiosos 10',
            poster: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',
            year: '2023',
            duration: '2h 21min',
            rating: '14'
        },
        {
            id: 'extraction2',
            title: 'Resgate 2',
            poster: 'https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg',
            year: '2023',
            duration: '2h 2min',
            rating: '16'
        },
        {
            id: 'topgun',
            title: 'Top Gun: Maverick',
            poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
            year: '2022',
            duration: '2h 11min',
            rating: '12'
        },
        {
            id: 'batman',
            title: 'Batman',
            poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
            year: '2022',
            duration: '2h 56min',
            rating: '14'
        },
        {
            id: 'blackpanther2',
            title: 'Pantera Negra: Wakanda Para Sempre',
            poster: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
            year: '2022',
            duration: '2h 41min',
            rating: '12'
        },
        {
            id: 'avatar2',
            title: 'Avatar: O Caminho da Água',
            poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
            year: '2022',
            duration: '3h 12min',
            rating: '12'
        }
    ],
    
    comedy: [
        {
            id: 'turning_red',
            title: 'Red: Crescer é uma Fera',
            poster: 'https://image.tmdb.org/t/p/w500/qsdjk9oAKSQMWs0Vt5Pyfh6O4GZ.jpg',
            year: '2022',
            duration: '1h 40min',
            rating: 'L'
        },
        {
            id: 'sonic2',
            title: 'Sonic 2: O Filme',
            poster: 'https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg',
            year: '2022',
            duration: '2h 2min',
            rating: 'L'
        },
        {
            id: 'minions2',
            title: 'Minions 2: A Origem de Gru',
            poster: 'https://img-place.com/pl6ne06aubag_t.jpg',
            year: '2022',
            duration: '1h 27min',
            rating: 'L',
            genre: ['Animação', 'Comédia', 'Família'],
            description: 'Gru e os Minions estão de volta! Descubra a origem do vilão mais querido do cinema em uma aventura hilariante.',
            embedUrl: 'https://filemoon.to/e/pl6ne06aubag/Minions_2_-_A_Origem_de_Gru_2022_1080p_WEB-DL_DUAL_5_1'
        },
        {
            id: 'lightyear',
            title: 'Lightyear',
            poster: 'https://image.tmdb.org/t/p/w500/ox4goZd956BxqJH6iLwhWPL9ct4.jpg',
            year: '2022',
            duration: '1h 45min',
            rating: 'L'
        },
        {
            id: 'strange_world',
            title: 'Mundo Estranho',
            poster: 'https://image.tmdb.org/t/p/w500/fHXTKE3rJ4qUVqv9Bm8XGdNF5Jy.jpg',
            year: '2022',
            duration: '1h 42min',
            rating: 'L'
        },
        {
            id: 'encanto',
            title: 'Encanto',
            poster: 'https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
            year: '2021',
            duration: '1h 42min',
            rating: 'L'
        },
        {
            id: 'elio_2025',
            title: 'Elio',
            poster: 'https://m.media-amazon.com/images/S/pv-target-images/7be4f64e7489bbc8c57bcfc35644b115091fcb13e78bf92e02194dbc89a42775.jpg',
            year: '2025',
            duration: '1h 38min',
            rating: 'L',
            genre: ['Animação', 'Aventura', 'Família'],
            description: 'Um jovem de 11 anos que sonha em ser astronauta acidentalmente se torna o embaixador intergaláctico da Terra.',
            embedUrl: 'https://filemoon.to/e/re3usn6ljot2/Elio_2025_WEB-DL_1080p_DUAL_5_1',
            isNew: true
        }
    ],
    
    series: [
        {
            id: 'stranger_things',
            title: 'Stranger Things',
            poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
            year: '2016-2025',
            duration: '4 temporadas',
            rating: '14',
            type: 'series',
            seasons: 4,
            totalEpisodes: 42,
            genre: ['Drama', 'Fantasia', 'Terror'],
            description: 'Um grupo de crianças enfrenta forças sobrenaturais em uma pequena cidade.',
            episodes: [
                {
                    season: 1,
                    episodes: [
                        { id: 1, title: 'O Desaparecimento de Will Byers', duration: '47min', embedUrl: 'https://filemoon.to/e/sample1/stranger-things-s1e1' },
                        { id: 2, title: 'A Estranha da Rua Maple', duration: '55min', embedUrl: 'https://filemoon.to/e/sample2/stranger-things-s1e2' },
                        { id: 3, title: 'Acenda uma Vela', duration: '51min', embedUrl: 'https://filemoon.to/e/sample3/stranger-things-s1e3' },
                        { id: 4, title: 'O Corpo', duration: '50min', embedUrl: 'https://filemoon.to/e/sample4/stranger-things-s1e4' },
                        { id: 5, title: 'Fuga do Laboratório Hawkins', duration: '52min', embedUrl: 'https://filemoon.to/e/sample5/stranger-things-s1e5' },
                        { id: 6, title: 'O Monstro', duration: '47min', embedUrl: 'https://filemoon.to/e/sample6/stranger-things-s1e6' },
                        { id: 7, title: 'A Banheira', duration: '42min', embedUrl: 'https://filemoon.to/e/sample7/stranger-things-s1e7' },
                        { id: 8, title: 'O Mundo Invertido', duration: '55min', embedUrl: 'https://filemoon.to/e/sample8/stranger-things-s1e8' }
                    ]
                },
                {
                    season: 2,
                    episodes: [
                        { id: 1, title: 'MADMAX', duration: '48min', embedUrl: 'https://filemoon.to/e/sample9/stranger-things-s2e1' },
                        { id: 2, title: 'Trick or Treat, Freak', duration: '56min', embedUrl: 'https://filemoon.to/e/sample10/stranger-things-s2e2' },
                        { id: 3, title: 'O Poluidor', duration: '51min', embedUrl: 'https://filemoon.to/e/sample11/stranger-things-s2e3' }
                    ]
                }
            ]
        },
        {
            id: 'the_witcher',
            title: 'The Witcher',
            poster: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
            year: '2019-2023',
            duration: '3 temporadas',
            rating: '16',
            type: 'series',
            seasons: 3,
            totalEpisodes: 24,
            genre: ['Ação', 'Aventura', 'Fantasia'],
            description: 'Geralt de Rívia, um caçador de monstros, busca seu destino.',
            episodes: [
                {
                    season: 1,
                    episodes: [
                        { id: 1, title: 'O Fim do Começo', duration: '60min' },
                        { id: 2, title: 'Quatro Marcos', duration: '60min' }
                    ]
                }
            ]
        },
        {
            id: 'wednesday',
            title: 'Wandinha',
            poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
            year: '2022',
            duration: '1 temporada',
            rating: '14',
            type: 'series',
            seasons: 1,
            totalEpisodes: 8,
            genre: ['Comédia', 'Terror', 'Mistério'],
            description: 'Wednesday Addams investiga mistérios sobrenaturais na Academia Nevermore.',
            episodes: [
                {
                    season: 1,
                    episodes: [
                        { id: 1, title: 'O Corvo de Quarta-feira', duration: '51min' },
                        { id: 2, title: 'Ai, Que Dor!', duration: '47min' }
                    ]
                }
            ]
        }
    ]
};
