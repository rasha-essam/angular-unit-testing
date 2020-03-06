import { HeroesComponent } from './heroes.component';
import { of } from 'rxjs';

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'SuperDude', strength: 55 }
        ];
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        component = new HeroesComponent(mockHeroService);
    });

    describe('delete', () => {

        // this can be called a state-based test as we check the state of the component
        it('should remove the indicated hero from the heroes list', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            expect(component.heroes.length).toBe(2);
        });

        // We also need to make an interaction test to the line where we call the heroService
        // that test will make sure that we called the delete method with the correct parameter
        it('should call deleteHero', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            //  expect(mockHeroService.deleteHero).toHaveBeenCalled();
            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);

        });

        it('should subscribe to the result', () => {
            const deleteHeroResult = jasmine.createSpyObj(['subscribe']);
            mockHeroService.deleteHero.and.returnValue(deleteHeroResult);
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            expect(deleteHeroResult.subscribe).toHaveBeenCalled();

        });

        xit('skipped test because having an x in front of it function', () => {

        });
    });

});

