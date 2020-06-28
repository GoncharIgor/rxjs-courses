import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {concatMap, finalize, tap} from 'rxjs/operators';

@Injectable()
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);

    // we are making separate observable, in order not to allow other listeners to have ability to emit values
    // only service has to emit new values
    // creates a new Obs, that emits the same values as in Subj
    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        // creating Observable with empty value, in order to be able to start an Observable chain
        return of(null).pipe(
            tap(() => this.loadingOn()),
            // concatMap() - takes values of source Observable (e.g. of(null)) and transforms to a new Obs, merging with another Obs
            concatMap(() => obs$),
            // finalize will always be executed, when above observable will complete or finish with error
            finalize(() => this.loadingOff())
        );
    }

    loadingOn() {
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);
    }
}

