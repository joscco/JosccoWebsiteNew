import {Component} from '@angular/core';
import {ProjectsMasonryComponent} from './projects-masonry/projects-masonry.component';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  imports: [
    ProjectsMasonryComponent,
  ]
})
export class MainViewComponent {
  items: {
    img: string,
    originalWidth: number,
    originalHeight: number,
    title: string,
    link?: string,
    subtitle?: string
  }[] = [
    {
      img: "images/RamenGodPage/finalImage.png",
      originalWidth: 700,
      originalHeight: 1000,
      title: "Ramen God",
      subtitle: "September 2022",
      link: "ramen-god"
    },
    {
      img: "images/ProjectSection/ProjectTeasers/2021_Adventskalender.png",
      originalWidth: 800,
      originalHeight: 400,
      title: "Adventskalender 2021",
      subtitle: "December 2021",
      link: "adventskalender-2021"
    }, {
      img: "images/ProjectSection/ProjectTeasers/2021_Adventskalender.png",
      originalWidth: 800,
      originalHeight: 400,
      title: "Adventskalender 2021",
      subtitle: "December 2021",
      link: "adventskalender-2021"
    }, {
      img: "images/ProjectSection/ProjectTeasers/2021_Adventskalender.png",
      originalWidth: 800,
      originalHeight: 400,
      title: "Adventskalender 2021",
      subtitle: "December 2021",
      link: "adventskalender-2021"
    },{
      img: "images/ProjectSection/ProjectTeasers/2021_Adventskalender.png",
      originalWidth: 800,
      originalHeight: 400,
      title: "Adventskalender 2021",
      subtitle: "December 2021",
      link: "adventskalender-2021"
    }, {
      img: "images/ProjectSection/ProjectTeasers/2021_Adventskalender.png",
      originalWidth: 800,
      originalHeight: 400,
      title: "Adventskalender 2021",
      subtitle: "December 2021",
      link: "adventskalender-2021"
    }, {
      img: "images/ProjectSection/2015_Schick.png",
      originalWidth: 800,
      originalHeight: 400,
      title: "Schick #15",
      subtitle: "August 2015",
      link: "schick-2015"
    }
  ]
}
