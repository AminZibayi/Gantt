'use client';
import { useState, useCallback } from 'react';
import { ImportResult } from '@/types';
import { parseCSV, parseExcel } from '@/utils/importUtils';

export function useImport() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const processFile = useCallback(async (file: File): Promise<ImportResult> => {
    setIsProcessing(true);
    try {
      let result: ImportResult;
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'csv') {
        result = await parseCSV(file);
      } else if (ext === 'xlsx' || ext === 'xls') {
        result = await parseExcel(file);
      } else {
        result = {
          data: [],
          links: [],
          errors: [{ type: 'error', message: `Unsupported file type: .${ext}` }],
          warnings: [],
        };
      }
      setImportResult(result);
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setImportResult(null);
  }, []);

  return { isProcessing, importResult, processFile, clearResult };
}
