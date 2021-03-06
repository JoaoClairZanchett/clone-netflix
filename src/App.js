/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect, useState} from 'react';
import Api from './api';
import './App.css';
import MovieRow from './components/MovieRow'
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';
import Footer from './components/Footer';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [useBlackHeader, setUseBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      let list = await Api.getHomeList();
      setMovieList(list);

      let originals = list.filter(item => item.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Api.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 20) {
        setUseBlackHeader(true);
      } else {
        setUseBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);
    return() => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])

  return (
    <div className="page">
      
      <Header black={useBlackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <Footer/>

      {movieList.length <= 0 && 
        <div className="loading">
            <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="Ícone de loading"/>
        </div>
      }

      
    </div>
  )
}
