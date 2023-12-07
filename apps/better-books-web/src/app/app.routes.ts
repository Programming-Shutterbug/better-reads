import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AboutComponent, BookStatusComponent, DashboardComponent} from '@nx-emma-indiv/better-books/frontend';
import { UserListComponent, UserDetailComponent, UserEditComponent, UserNewComponent} from '@nx-emma-indiv/better-books/frontend';
import { BookListComponent, BookDetailComponent, BookEditComponent, BookNewComponent} from '@nx-emma-indiv/better-books/frontend';
import { WriterListComponent, WriterDetailComponent, WriterEditComponent, WriterNewComponent} from '@nx-emma-indiv/better-books/frontend';
import { RegisterComponent, LoginComponent, HomepageComponent } from '@nx-emma-indiv/better-books/frontend';


export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: HomepageComponent
    },
    {   
        path: 'user/login', 
        pathMatch: 'full', 
        component: LoginComponent 
    },
    { 
        path: 'register', 
        pathMatch: 'full', 
        component: RegisterComponent 
    },
    {
        path: 'about',
        pathMatch: 'full',
        component: AboutComponent
    },
    //Writer routes
    { 
        path: "writers", 
        pathMatch: "full", 
        component: WriterListComponent },
    { 
        path: "newwriter", 
        pathMatch: "full", 
        component: WriterNewComponent },
    { 
        path: "writers/:_id", 
        pathMatch: "full", 
        component: WriterDetailComponent },
    { 
        path: "writers/:_id/editwriter", 
        pathMatch: "full", 
        component: WriterEditComponent },


    //User routes
    {
        path: ':_id/dashboard',
        pathMatch: 'full',
        component: DashboardComponent
    },
    { 
        path: "users", 
        pathMatch: "full", 
        component: UserListComponent },
    { 
        path: "new", 
        pathMatch: "full", 
        component: UserNewComponent },
    { 
        path: "users/:_id", 
        pathMatch: "full", 
        component: UserDetailComponent },
    { 
        path: "users/:_id/edit", 
        pathMatch: "full", 
        component: UserEditComponent },
        
    //Book routes
    { 
        path: "books", 
        pathMatch: "full", 
        component: BookListComponent },
    { 
        path: "books/newbook", 
        pathMatch: "full", 
        component: BookNewComponent },
    { 
        path: "books/:_id", 
        pathMatch: "full", 
        component: BookDetailComponent },
    { 
        path: "books/:_id/:userId/booklist", 
        pathMatch: "full", 
        component: BookStatusComponent },
    { 
        path: "books/:_id/editbook", 
        pathMatch: "full", 
        component: BookEditComponent },
 

    { path: '**', redirectTo: 'homepage' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})

export class AppRoutingModule {}
