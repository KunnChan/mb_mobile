import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../search/search.module').then(m => m.SearchPageModule)
          }
        ]
      },
      {
        path: 'search/:albumId',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../search/search.module').then(m => m.SearchPageModule)
          }
        ]
      },
      {
        path: 'music',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../music/music.module').then(m => m.MusicPageModule)
          }
        ]
      },
      {
        path: 'songlist',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../songlist/songlist.module').then(m => m.SonglistPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'setup',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../setup/setup.module').then(m => m.SetupPageModule)
          }
        ]
      },
      {
        path: 'feedback',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../feedback/feedback.module').then(m => m.FeedbackPageModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../about/about.module').then(m => m.AboutPageModule)
          }
        ]
      },
      {
        path: 'playlist',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../playlist/playlist.module').then(m => m.PlaylistPageModule)
          }
        ]
      },
      {
        path: 'login',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../login/login.module').then(m => m.LoginPageModule)
          }
        ]
      },
      {
        path: 'signup',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../signup/signup.module').then(m => m.SignupPageModule)
          }
        ]
      },
      {
        path: 'forget',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../forget/forget.module').then(m => m.ForgetPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
