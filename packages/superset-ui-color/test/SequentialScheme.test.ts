import SequentialScheme from '../src/SequentialScheme';

describe('SequentialScheme', () => {
  const scheme = new SequentialScheme({
    id: 'white to black',
    colors: ['#fff', '#000'],
  });
  it('exists', () => {
    expect(SequentialScheme).toBeDefined();
  });
  describe('new SequentialScheme()', () => {
    it('creates new instance', () => {
      const scheme2 = new SequentialScheme({
        id: 'white to black',
        colors: ['#fff', '#000'],
      });
      expect(scheme2).toBeInstanceOf(SequentialScheme);
    });
  });
  describe('.createLinearScale(domain, modifyRange)', () => {
    it('returns a piecewise scale', () => {
      const scale = scheme.createLinearScale([10, 100]);
      expect(scale.domain()).toHaveLength(scale.range().length);
      const scale2 = scheme.createLinearScale([0, 10, 100]);
      expect(scale2.domain()).toHaveLength(scale2.range().length);
    });
    describe('domain', () => {
      it('returns a linear scale for the given domain', () => {
        const scale = scheme.createLinearScale([10, 100]);
        expect(scale(1)).toEqual('rgb(255, 255, 255)');
        expect(scale(10)).toEqual('rgb(255, 255, 255)');
        expect(scale(55)).toEqual('rgb(119, 119, 119)');
        expect(scale(100)).toEqual('rgb(0, 0, 0)');
        expect(scale(1000)).toEqual('rgb(0, 0, 0)');
      });
      it('uses [0, 1] as domain if not specified', () => {
        const scale = scheme.createLinearScale();
        expect(scale(-1)).toEqual('rgb(255, 255, 255)');
        expect(scale(0)).toEqual('rgb(255, 255, 255)');
        expect(scale(0.5)).toEqual('rgb(119, 119, 119)');
        expect(scale(1)).toEqual('rgb(0, 0, 0)');
        expect(scale(2)).toEqual('rgb(0, 0, 0)');
      });
    });
    describe('modifyRange', () => {
      const scheme3 = new SequentialScheme({
        id: 'test-scheme3',
        colors: ['#fee087', '#fa5c2e', '#800026'],
      });
      it('modifies domain by default', () => {
        const scale = scheme3.createLinearScale([0, 100]);
        expect(scale.domain()).toEqual([0, 50, 100]);
        expect(scale.range()).toEqual(['#fee087', '#fa5c2e', '#800026']);
      });
      it('modifies range instead of domain if set to true', () => {
        const scale = scheme3.createLinearScale([0, 100], true);
        expect(scale.domain()).toEqual([0, 100]);
        expect(scale.range()).toEqual(['rgb(254, 224, 135)', 'rgb(128, 0, 38)']);
      });
    });
  });
  describe('.getColors(numColors, extent)', () => {
    describe('numColors', () => {
      it('returns the original colors if numColors is not specified', () => {
        expect(scheme.getColors()).toEqual(['#fff', '#000']);
      });
      it('returns the exact number of colors if numColors is specified', () => {
        expect(scheme.getColors(2)).toEqual(['#fff', '#000']);
        expect(scheme.getColors(3)).toEqual([
          'rgb(255, 255, 255)',
          'rgb(119, 119, 119)',
          'rgb(0, 0, 0)',
        ]);
        expect(scheme.getColors(4)).toEqual([
          'rgb(255, 255, 255)',
          'rgb(162, 162, 162)',
          'rgb(78, 78, 78)',
          'rgb(0, 0, 0)',
        ]);
      });
    });
    describe('extent', () => {
      it('adjust the range if extent is specified', () => {
        expect(scheme.getColors(2, [0, 0.5])).toEqual(['rgb(255, 255, 255)', 'rgb(119, 119, 119)']);
        expect(scheme.getColors(2, [0.5, 1])).toEqual(['rgb(119, 119, 119)', 'rgb(0, 0, 0)']);
      });
    });
  });
});
