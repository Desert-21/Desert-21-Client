import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { GameStateService } from 'src/app/services/http/game-state.service';
import { Game, Field } from '../../../models/game-models';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  myColor = 'rgba(0, 255, 0, 1.0)';
  player1Color = 'rgba(255, 255, 0, 0.3)';
  player2Color = 'rgba(255, 70, 0, 0.3)';
  player3Color = 'rgba(210, 70, 140, 0.3)';
  player4Color = 'rgba(180, 0, 0, 0.3)';

  numbers: Array<number>;

  constructor(private http: HttpClient, private gameService: GameStateService){
    this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  fields: Array<Array<Field>>;

  initFields(): void {
    this.fields = [];
    for (let i = 0; i < 11; i++){
      this.fields.push([]);
      for (let j = 0; j < 11; j++){
        const field: Field = {
          building: {
            type: 'EMPTY_FIELD',
            level: 0,
          },
          ownerId: '',
          army: {
            droids: 0,
            tanks: 0,
            cannons: 0,
          }
        };
        this.fields[i].push(field);
      }
    }
  }

  ngOnInit(): void {
    this.initFields();
    this.gameService.getStateUpdates().subscribe(resp => this.fields = resp.fields);
    this.gameService.requestState();
  }

  fieldToImagePath(field: Field): string {
    const type = field.building.type;
    switch (type) {
      case 'METAL_FACTORY':
        return '/assets/metal.png';
      case 'BUILDING_MATERIALS_FACTORY':
        return '/assets/buildingMaterials.png';
      case 'ELECTRICITY_FACTORY':
        return '/assets/electricity.png';
      case 'HOME_BASE':
        return '/assets/home.png';
      case 'ROCKET_LAUNCHER':
        return '/assets/rocket.png';
      case 'TOWER':
        return '/assets/tower.png';

    }
    return '/assets/blank.png';
  }


  isLinkableVertically(row, col): boolean {
    return row < 10;
  }

  isLinkableHorizontally(row, col): boolean {
    return col < 10;
  }

  // isSomethingThere(row: number, col:number){
  //   return this.infoService.areaUnits[row][col].MAIN_BUILDING != null;
  // }

  getBackground(): string {
    return 'url(\'assets/game-graphics/game-background.jpg\')';
  }

  // getSource(row: number, col: number){
  //   let label = this.getLabel(row, col);
  //   return this.translator.getBoardIconSource(label);
  // }

  // getLabel(row: number, col: number){
  //   let areaUnit = this.infoService.areaUnits[row][col];
  //   let mainBuilding = areaUnit.MAIN_BUILDING;
  //   if (mainBuilding == null){
  //     return ""
  //   }
  //   else {
  //     return mainBuilding.LABEL;
  //   }
  // }

  transformLabel(label: string): string{
    switch (label){
      case 'TOWER':
        return '<button type = "button">aa</button>';
      case 'MAIN_TOWER':
        return 'H';
      case 'ROCKET':
        return 'R';
      case 'BIG_METAL':
        return 'M';
      case 'BIG_BUILDING_MATERIALS':
        return 'B';
      case 'BIG_ELECTRICITY':
        return 'E';
      default:
        return '?';

    }
  }

  trackBy(index: any, item: any): number {
    return index;
  }

}
