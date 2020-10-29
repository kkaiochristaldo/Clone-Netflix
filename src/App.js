  import React, {useEffect, useState} from "react";

  import MovieRow from "./components/MovieRow";
  import FeaturedMovie from "./components/FeaturedMovie";
  import Header from "./components/Header";
  import './App.css';

  import Tmdb from "./Tmdb";

  export default () => {

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null)
    const [blackHeader, setBlackHeader] = useState(false);
    
    useEffect( () => {
      const loadAll = async () => {
        let list = await Tmdb.getHomeList();
        setMovieList(list);
        console.log(list)

        let originals = list.filter(i=>i.slug === "originals");
        let ramdomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1))
        let chosen = originals[0].items.results[ramdomChosen];
        let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
        console.log(chosenInfo)

        setFeaturedData(chosenInfo);

      }
      loadAll();
    }, []);

    useEffect(() => {
      const scrollListener = () => {
        if (window.scrollY > 10) {
          setBlackHeader(true);
        } else {
          setBlackHeader(false);
        }
      }
      window.addEventListener("scroll", scrollListener);
      return () => {
        window.removeEventListener("scroll", scrollListener);
      }
    }, [])

    

    return (
      <div className="page" >
          <Header black={blackHeader} />
          {featuredData && 
            < FeaturedMovie item={featuredData} />
          }
          <section className="lists">
            {movieList.map((item, key) => (
              <MovieRow key={key} title={item.title} items={item.items} />
            ))}
          </section>
          <footer>
            Feito com amor por <strong>Kaio Christaldo!</strong><br/>
            Direito de imagens para a Netflix <br/>
            Dados pegos do site themoviedb.org
          </footer>
          {movieList.length <= 0 && 
            <div className="loading">
              <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif" alt="carregando" />
            </div>
          }
      </div>
    )

  }
