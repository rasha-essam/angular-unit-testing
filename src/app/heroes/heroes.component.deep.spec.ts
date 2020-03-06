import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { HeroComponent } from './../hero/hero.component';
import { NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[routerLink]',
    // tslint:disable-next-line: use-host-property-decorator
    host: { '(click)': 'onClick()' } // register event listener on the host element
})
class RouterLinkStubDirective {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent (deep tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;


    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'SuperDude', strength: 55 }
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkStubDirective
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ]
            // ,
            // schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroesComponent);
        //  const  TestBed.get(RouterLinkDirectiveStub);


    });

    it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        // run ngOnInit
        fixture.detectChanges();

        // expect(fixture.debugElement.queryAll(By.css('app-hero')).length).toBe(3);

        const heroComponentDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDebugElements.length).toBe(3);
        // expect(heroComponentDebugElements[0].componentInstance.hero.name).toEqual('SpiderDude');
        for (let i = 0; i < heroComponentDebugElements.length; i++) {
            expect(heroComponentDebugElements[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    });

    it(`should call heroService.deleteHero when the Hero Component's
     delete button is clicked`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponents[0].query(By.css('button'))
            .triggerEventHandler('click', { stopPropagation: () => { } });
        // we created obj by hand instead of a spy


        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

    });

    // its better to just raise the event in the test here and to not worry about
    // the child component button because it should have its own test that makes sure
    // the wiring between the delete button and the function inside the component is right

    it(`should call heroService.deleteHero when the Hero Component's
            delete event is emitted`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        (heroComponents[0].componentInstance as HeroComponent).delete.emit(undefined);

        // the following hashed line just raises the delete event directly
        // from the child component without calling a function or a button

        //  heroComponents[0].triggerEventHandler('delete', null);

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

    });

    it('should add a new hero to the hero list when the add button is clicked', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const name = 'Mr. Ice';
        mockHeroService.addHero.and.returnValue(of({ id: 5, name: name, strength: 4 }));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const button = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        button.triggerEventHandler('click', null);
        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);

    });

    it('should have the correct route for the first hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        const firstHeroComponent = fixture.debugElement.queryAll(By.directive(HeroComponent))[0];

        // I need to get the actual instance of the RouterLinkStubDirective class
        const routerLink = firstHeroComponent.query(By.directive(RouterLinkStubDirective))
            .injector.get(RouterLinkStubDirective);

        firstHeroComponent.query(By.css('a')).triggerEventHandler('click', null);

        expect(routerLink.navigatedTo).toBe('/detail/1');

    });

});
