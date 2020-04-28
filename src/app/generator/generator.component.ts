import { Component, OnInit } from '@angular/core';
import { GeneratorService } from '../../api/service/generator.service';
import { Generator } from '../../api/model/generator';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {

  tableTitle = ["", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  generator: Generator;

  constructor(
    private generatorService: GeneratorService
  ) {
  }

  ngOnInit(): void {
    this.getGenerator();
  }

  onChangeCharactor(e) {
    if (e.key === "Enter") {
    } else {
      if ((e.key >= 'a') && (e.key <= 'z')) {
        this.generator.inChar = e.key;
      } else {
        this.generator.inChar = '';
      }
    }
  }

  onClickGenerate() {
    this.generatorService.startGenerator();
  }

  getGenerator() {
    this.generatorService.getGeneratorData().subscribe(data => this.generator = data);
  }
}
