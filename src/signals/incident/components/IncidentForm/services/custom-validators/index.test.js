import { validateFileType, validateMaxFilesize } from './index';

describe('The costom validators service', () => {
  describe('should validate file type', () => {
    const meta = {
      allowedFileTypes: ['image/jpeg', 'application/pdf']
    };

    it('with correct file type', () => {
      const file = {
        type: 'application/pdf'
      };
      expect(validateFileType(file, meta)).toEqual(null);
    });

    it('with incorrect file type', () => {
      const file = {
        type: 'unknown/type'
      };

      expect(validateFileType(file, meta)).toEqual({
        custom: 'Dit bestand heeft niet het juiste type.'
      });
    });

    it('with empty value', () => {
      expect(validateFileType()).toEqual(null);
    });
  });

  describe('should validate max file size', () => {
    const meta = {
      maxFileSize: 1000
    };

    it('with correct file type', () => {
      const file = {
        size: 999
      };

      expect(validateMaxFilesize(file, meta)).toEqual(null);
    });

    it('with incorrect file type', () => {
      const file = {
        size: 1000
      };

      expect(validateMaxFilesize(file, meta)).toEqual({
        custom: 'Dit bestand is te groot.'
      });
    });

    it('with empty value', () => {
      expect(validateMaxFilesize()).toEqual(null);
    });
  });
});
