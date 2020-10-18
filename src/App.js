import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import './App.css';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header/Header';

export default () => {
    const [movieList, setmovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            // Pegando a lista totall
            let list = await Tmdb.getHomeList();
            setmovieList(list);

            let originals = list.filter((i) => i.slug === 'originals');
            let randomChosen = await Math.floor(
                Math.random() * (originals[0].items.results.length - 1)
            );
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

            setFeaturedData(chosenInfo);
        };

        loadAll();
    }, []);
    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 80) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        };
        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        };
    }, []);
    return (
        <div className="page">
            <Header black={blackHeader}></Header>

            {featuredData && (
                <FeaturedMovie item={featuredData}></FeaturedMovie>
            )}

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow
                        key={key}
                        title={item.title}
                        items={item.items}
                    ></MovieRow>
                ))}
            </section>

            <footer>
                Feito Com <span role="img" aria-label="coração"></span>
            </footer>
            {movieList <= 0 && (
                <div className="loading">
                    <img
                        src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
                        alt="loading"
                        alt="Carregando"
                    />
                </div>
            )}
        </div>
    );
};
