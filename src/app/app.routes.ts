import { Routes } from '@angular/router';
import { TitleScreenComponent } from './components/title-screen/title-screen.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';

export const routes: Routes = [
    {path: "", component: TitleScreenComponent},
    {path: "data", component: MainScreenComponent},
    { path: "**", redirectTo: "" },
];
