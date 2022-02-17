import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { GameStateService } from 'src/app/services/game-state.service';
import { Game, Field } from '../../../models/game-models';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  myColor: string = "rgba(0, 255, 0, 1.0)";
  player1Color: string = "rgba(255, 255, 0, 0.3)";
  player2Color: string = "rgba(255, 70, 0, 0.3)";
  player3Color: string = "rgba(210, 70, 140, 0.3)";
  player4Color: string = "rgba(180, 0, 0, 0.3)";

  numbers: Array<number>;

  constructor(private http: HttpClient, private gameService: GameStateService){
    gameService.getGameStateUpdates();
    this.numbers = [0,1,2,3,4,5,6,7,8,9,10]
  }

  fields: Array<Array<Field>>;

  initFields(): void {
    this.fields = [];
    for (let i = 0; i < 11; i++){
      this.fields.push([]);
      for (let j = 0; j < 11; j++){
        let field: Field = {
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
        }
        this.fields[i].push(field);
      }
    }
  }

  ngOnInit(): void {
    this.initFields();
    this.gameService.getGameStateUpdates().subscribe(resp => this.fields = resp.fields);
    this.gameService.requestGameState();
  }

  fieldToImagePath(field: Field): string {
    let type = field.building.type;
    switch(type) {
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


  isLinkableVertically(row, col){
    return row < 10;
  }

  isLinkableHorizontally(row, col){
    return col < 10;
  }

  // isSomethingThere(row: number, col:number){
  //   return this.infoService.areaUnits[row][col].MAIN_BUILDING != null;
  // }

  getBackground(){
    return "url('assets/game-graphics/game-background.jpg')";
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

  transformLabel(label: string){
    switch (label){
      case "TOWER":
        return '<button type = "button">aa</button>';
      case "MAIN_TOWER":
        return "H";
      case "ROCKET":
        return "R";
      case "BIG_METAL":
        return "M";
      case "BIG_BUILDING_MATERIALS":
        return "B";
      case "BIG_ELECTRICITY":
        return "E";
      default:
        return "?";

    }
  }

}
