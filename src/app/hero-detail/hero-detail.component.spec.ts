import { TestBed, ComponentFixture, fakeAsync, tick, flush, async } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from '../hero.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HeroDetailComponent', () => {

    let mockActivatedRoute, mockHeroService, mockLocation;
    let fixture: ComponentFixture<HeroDetailComponent>;

    beforeEach(() => {
        mockActivatedRoute = {
            snapshot: { paramMap: { get() { return '3'; } } }
        };
        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);

        TestBed.configureTestingModule({
            declarations: [
                HeroDetailComponent
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService },
                { provide: Location, useValue: mockLocation },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroDetailComponent);

        mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 100 }));

    });

    it('should render hero name in a h2 tag', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('SUPERDUDE');
        // const h2Element = fixture.debugElement.query(By.css('h2')).nativeElement;
        // expect(h2Element.textContent).toContain('SuperDude'.toUpperCase());

    });

    xit('should call updateHero when save is called (Time-Consuming)', (done) => {
        // jasmine test will understand that the test is async because of passing the done fn
        // it will wait for the done function to be called inorder to finish the test
        // but that is time-consuming and we need our tests to be fast

        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();

        setTimeout(() => {
            expect(mockHeroService.updateHero).toHaveBeenCalled();
            done();
        }, 300);

    });

    // fakeAsync can work with a promise and a timeout and pretty much all aother async types
    it('should call updateHero when save is called', fakeAsync(() => {

        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        // tick(250); could use flush() instead of tick if we don't know how long we should wait
        flush();

        expect(mockHeroService.updateHero).toHaveBeenCalled();

    }));

    // when can use "async" ONLY if we deal with promises (can't work with timeout for example)
    // it('should call updateHero when save is called', async(() => {

    //     mockHeroService.updateHero.and.returnValue(of({}));
    //     fixture.detectChanges();

    //     fixture.componentInstance.save();

    //     fixture.whenStable().then(() => {
    //         expect(mockHeroService.updateHero).toHaveBeenCalled();
    //     });
    // }));
});
