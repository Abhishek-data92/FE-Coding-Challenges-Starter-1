import { Component, OnDestroy, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { DataService, MovieComplete } from '../../services/data.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html'
})
export class MoviesComponent implements OnDestroy, OnInit {
  public currDecade: number | undefined;
  public decades: number[] = [];
  public filteredMovies: MovieComplete[] = [];
  public movies: MovieComplete[] = [];
  private moviesSubscription: any;
  public generateAltText(movie: MovieComplete): string {
    return `Movie Poster: ${movie.Title}`;
  } //generates the alt text

  constructor(private dataService: DataService) {}

  public ngOnInit(): void {
    this.moviesSubscription = this.dataService.getMovies().pipe(
      tap((data) => {
        this.decades = data.Decades;
        this.movies = data.Search;
      })
    ).subscribe(() => {
      this.displayMovies();
    });
  }
  
  public ngOnDestroy(): void {
    this.moviesSubscription.unsubscribe();
  }

  public displayMovies(decade?: number): void {
    if (!this.movies?.length) {
      this.filteredMovies = [];
      return;
    }

    this.currDecade = decade;
    this.filteredMovies = this.dataService.getFilteredMovies(this.movies, decade);
  }
}
