import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };

        expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
    });

    it('should render the hero name in an anchor tag', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };
        fixture.detectChanges();

        // expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');

        // there is debugElement which is similar to nativeElement
        // (the nativeElement just exposing the underlying DOM API) , but debugElement is more of
        // a wrapper that has a different set of functionalities that is very similar to the native element

        // the debug element has access to things more than that of native element,
        // for example can access the directives added to the node, also it can access the component instance attached to it

        const debugElementAnchor = fixture.debugElement.query(By.css('a'));
        expect(debugElementAnchor.nativeElement.textContent).toContain('SuperDude');
    });

});
