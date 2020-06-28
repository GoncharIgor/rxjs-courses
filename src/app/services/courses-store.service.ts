import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {catchError, map, shareReplay, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from '../loading/loading.service';
import {MessagesService} from '../messages/messages.service';
import {Lesson} from '../model/lesson';

@Injectable({
    providedIn: 'root'
})
export class CoursesStoreService {
    private subject = new BehaviorSubject<Course[]>([]);

    public courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(private http: HttpClient,
                private loadingService: LoadingService,
                private messagesService: MessagesService) {

        // because we have global service instance, this will happen only once and we'll have a store with its state
        this.loadAllCourses();
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$.pipe(
            map(courses =>
                courses.filter(course => course.category === category)
                    .sort(sortCoursesBySeqNo)
            )
        );
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses').pipe(
            map(response => response['payload']),
            // we need to provide a new observable, that will replace a failed ones
            catchError(err => {
                const message = 'Could not load courses';
                this.messagesService.showErrors(message);
                console.log(message, err);
                // terminating our initial loadAllCourses() observable chain
                return throwError(err);
            }),
            tap(courses => this.subject.next(courses))
        );

        this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        const courses = this.subject.getValue(); // gets the last value (resolved)
        const courseIndex = courses.findIndex(course => course.id === courseId);

        const updatedCourse: Course = {
            ...courses[courseIndex],
            ...changes
        };

        const resultCourses = [...courses];
        resultCourses[courseIndex] = updatedCourse;

        this.subject.next(resultCourses);
        return this.http.put(`/api/courses/${courseId}`, changes).pipe(
            catchError(err => {
                const message = 'Could not save course';
                this.messagesService.showErrors(message);
                console.log(message, err);
                // terminating our initial loadAllCourses() observable chain
                return throwError(err);
            }),
            shareReplay(),
        );
    }

    loadCourseById(id: number): Observable<Course> {
        return this.http.get<Course>(`/api/courses/${id}`).pipe(
            shareReplay()
        );
    }

    loadAllCourseLessons(courseId: number): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                pageSize: '10000',
                courseId: courseId.toString()
            }
        }).pipe(
            map(response => response['payload']),
            shareReplay()
        );
    }

    searchLessons(search: string): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                filter: search,
                pageSize: '100'
            }
        }).pipe(
            map(response => response['payload']),
            shareReplay()
        );
    }
}
