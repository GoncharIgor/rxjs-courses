import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CoursesStoreService} from '../services/courses-store.service';

@Component({
    selector: 'course',
    templateUrl: './search-lessons.component.html',
    styleUrls: ['./search-lessons.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLessonsComponent implements OnInit {
    searchResults$: Observable<Lesson[]>;
    activeLesson: Lesson;

    constructor(private coursesStoreService: CoursesStoreService) {
    }

    ngOnInit() {

    }

    onSearch(search: string) {
        this.searchResults$ = this.coursesStoreService.searchLessons(search);
    }

    openLesson(lesson: Lesson) {
        this.activeLesson = lesson;
    }

    onBackToSearch() {
        this.activeLesson = null;
    }
}
