'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Lightbulb } from 'lucide-react';
import type { StructuredPDFData } from '@/lib/pdf-extractor';
import { cn } from '@/lib/utils';

interface ExtractedDataDisplayProps {
  data: StructuredPDFData;
  sourceText: string;
  onTextHighlight?: (text: string, pageIndex?: number) => void;
}

export function ExtractedDataDisplay({ data, sourceText, onTextHighlight }: ExtractedDataDisplayProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const highlightTextInSource = (fieldValue: string) => {
    if (onTextHighlight) {
      onTextHighlight(fieldValue);
    }
    // Also highlight in the source text preview
    setHoveredField(fieldValue);
  };

  const getHighlightedSourceText = () => {
    if (!hoveredField || hoveredField.length < 3) {
      return sourceText.substring(0, 500);
    }

    // Create highlighted version with context
    const regex = new RegExp(`(${hoveredField.split(' ').join('|')})`, 'gi');
    const parts = sourceText.split(regex);
    
    return parts
      .map((part, idx) => {
        if (regex.test(part)) {
          return `<mark class="bg-yellow-200 font-semibold">${part}</mark>`;
        }
        return part;
      })
      .join('')
      .substring(0, 500);
  };

  return (
    <Tabs defaultValue="structured" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="structured" className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Extracted Data
        </TabsTrigger>
        <TabsTrigger value="preview" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Source Preview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="structured" className="space-y-4">
        {/* Key Metadata */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Case Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.structuredData.caseNumber && (
                <div
                  className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  onMouseEnter={() => highlightTextInSource(data.structuredData.caseNumber!)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <p className="text-sm text-muted-foreground mb-1">Case Number</p>
                  <p className="font-semibold text-sm">{data.structuredData.caseNumber}</p>
                </div>
              )}
              
              {data.structuredData.courtName && (
                <div
                  className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  onMouseEnter={() => highlightTextInSource(data.structuredData.courtName!)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <p className="text-sm text-muted-foreground mb-1">Court</p>
                  <p className="font-semibold text-sm">{data.structuredData.courtName}</p>
                </div>
              )}

              {data.structuredData.judge && (
                <div
                  className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  onMouseEnter={() => highlightTextInSource(data.structuredData.judge!)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <p className="text-sm text-muted-foreground mb-1">Judge</p>
                  <p className="font-semibold text-sm">{data.structuredData.judge}</p>
                </div>
              )}

              {data.structuredData.dateOfOrder && (
                <div
                  className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  onMouseEnter={() => highlightTextInSource(data.structuredData.dateOfOrder!)}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <p className="text-sm text-muted-foreground mb-1">Date of Order</p>
                  <p className="font-semibold text-sm">{data.structuredData.dateOfOrder}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parties */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Parties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.structuredData.petitioner && (
              <div
                className="p-3 border-l-4 border-green-500 bg-green-50 rounded-r-lg hover:bg-green-100 cursor-pointer transition-colors"
                onMouseEnter={() => highlightTextInSource(data.structuredData.petitioner!)}
                onMouseLeave={() => setHoveredField(null)}
              >
                <p className="text-sm text-muted-foreground mb-1">Petitioner</p>
                <p className="font-semibold">{data.structuredData.petitioner}</p>
              </div>
            )}
            {data.structuredData.respondent && (
              <div
                className="p-3 border-l-4 border-red-500 bg-red-50 rounded-r-lg hover:bg-red-100 cursor-pointer transition-colors"
                onMouseEnter={() => highlightTextInSource(data.structuredData.respondent!)}
                onMouseLeave={() => setHoveredField(null)}
              >
                <p className="text-sm text-muted-foreground mb-1">Respondent</p>
                <p className="font-semibold">{data.structuredData.respondent}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Final Decision */}
        {data.structuredData.finalDecision && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Final Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-3 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg hover:bg-amber-100 cursor-pointer transition-colors"
                onMouseEnter={() => highlightTextInSource(data.structuredData.finalDecision!)}
                onMouseLeave={() => setHoveredField(null)}
              >
                <p className="font-semibold text-sm">{data.structuredData.finalDecision}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Directions */}
        {data.structuredData.keyDirections && data.structuredData.keyDirections.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Key Directions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.structuredData.keyDirections.map((direction, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                    onMouseEnter={() => highlightTextInSource(direction)}
                    onMouseLeave={() => setHoveredField(null)}
                  >
                    <div className="flex items-start gap-2">
                      <Badge className="mt-1 shrink-0">{idx + 1}</Badge>
                      <p className="text-sm">{direction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {data.structuredData.summary && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">{data.structuredData.summary}</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="preview" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Source Text Preview</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Hover over extracted data to highlight matching text from the PDF
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg border">
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap font-mono max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html: getHighlightedSourceText(),
                }}
              />
              <p className="text-xs text-muted-foreground mt-3">
                {sourceText.length > 500 ? '... (truncated preview)' : ''}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline">Pages: {data.pageCount}</Badge>
              <Badge variant="outline">Words: {data.wordCount}</Badge>
              <Badge variant="outline">Confidence: {data.confidence}%</Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
