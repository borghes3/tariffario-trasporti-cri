"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AutocompleteInput from "./AutoCompleteInput";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function Page() {

  const [ospedaleId, setOspedaleId] = useState("");
  const [casaId, setCasaId] = useState("");
  const [distanze, setDistanze] = useState<{
    comitatoToOspedale: {
      text: string,
      value: number,
    },
    ospedaleToCasa: {
      text: string,
      value: number,
    },
    casaToComitato: {
      text: string,
      value: number,
    }
  } | null>(null);
  const [accompagnatore, setAccompagnatore] = useState<boolean>(false);

  const calcola = async () => {
    const res = await fetch("/api/distanze", {
      method: "POST",
      body: JSON.stringify({ ospedaleId, casaId }),
    });
    const data = await res.json();
    setDistanze(data);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 p-4">

      <Card className="w-full max-w-xl rounded-sm shadow-sm flex items-center justify-center gap-3 p-4">
        <CardHeader className="p-0 m-0 w-full">
          <CardTitle className="w-full m-0 p-0 uppercase text-lg">Dati del percorso</CardTitle>
        </CardHeader>
        <Separator className="mb-2" />
        <div className="w-full flex flex-col items-center justify-center gap-0">
          <span className="text-md uppercase font-semibold">Struttura</span>
          <span className="text-sm text-muted-foreground">Indirizzo di carico del paziente</span>
        </div>
        <AutocompleteInput onSelect={(id) => setOspedaleId(id)} />

        <div className="w-full flex flex-col items-center justify-center gap-0">
          <span className="text-md uppercase font-semibold">Destinazione</span>
          <span className="text-sm text-muted-foreground">Indirizzo di scarico del paziente</span>
        </div>
        <AutocompleteInput onSelect={(id) => setCasaId(id)} />

        <Button className="w-full" variant={'destructive'} onClick={calcola} disabled={!ospedaleId || !casaId}>
          Calcola Tariffa
        </Button>
      </Card>

      {distanze && <Card
        className={`w-full max-w-xl rounded-sm shadown-sm flex flex-col items-center justify-center gap-2 p-0`}
      >
        <span className="text-lg font-semibold uppercase p-0 mt-2 text-red-600">Tariffa calcolata</span>
        <Table className="w-full m-0 p-0 border-t">
          <TableBody>
            <TableRow>
              <TableCell className="px-3 py-2 flex flex-col items-start justify-center">
                <span className="flex items-center justify-center gap-1 uppercase font-semibold">Comitato <ArrowRightIcon size={14} /> Struttura</span>
                <span>{distanze.comitatoToOspedale.text}</span>
              </TableCell>
              <TableCell rowSpan={2} className="border-l">
                <div className="flex flex-col items-center">
                  <span className="uppercase font-semibold">Andata</span>
                  <span className="font-medium">{((distanze.comitatoToOspedale.value + distanze.ospedaleToCasa.value) / 1000).toFixed(1)} km</span>
                </div>
              </TableCell>
              <TableCell rowSpan={2} className="border-l">
                <span className="uppercase font-semibold">{
                  Math.ceil(
                    ((distanze.comitatoToOspedale.value + distanze.ospedaleToCasa.value) / 1000) > 15 // Se eccede i 15km
                      ? 46 + (((distanze.comitatoToOspedale.value + distanze.ospedaleToCasa.value) / 1000) - 15) * 0.95
                      : 46    // Tariffa base
                  )
                } €</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-3 py-2 flex flex-col items-start justify-center">
                <span className="flex items-center justify-center gap-1 uppercase font-semibold">Struttura <ArrowRightIcon size={14} /> Destinazione</span>
                <span>{distanze.ospedaleToCasa.text}</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="px-3 py-2 flex flex-col items-start justify-center">
                <span className="flex items-center justify-center gap-1 uppercase font-semibold">Destinazione <ArrowRightIcon size={14} /> Comitato</span>
                <span>{distanze.casaToComitato.text}</span>
              </TableCell>
              <TableCell className="border-l">
                <div className="flex flex-col items-center">
                  <span className="uppercase font-semibold">Ritorno</span>
                  <span className="font-medium">{distanze.casaToComitato.text}</span>
                </div>
              </TableCell>
              <TableCell className="border-l">
                <span className="uppercase font-semibold">{
                  Math.ceil(
                    ((distanze.casaToComitato.value / 1000) > 15 // Se eccede i 15km
                      ? 46 + ((distanze.casaToComitato.value / 1000) - 15) * 0.95
                      : 46
                    )
                  )
                } €</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} className="text-left">
                <span>ACCOMPAGNATORE (Singola Tratta)</span>
              </TableCell>
              <TableCell className="border-l"><Checkbox onCheckedChange={(checked) => {
                if (typeof checked != "string") {
                  setAccompagnatore(checked === true)
                }
              }} /></TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2} className="text-left">
                <span className="font-semibold uppercase">Totale</span>
              </TableCell>
              <TableCell className="border-l">
                <span className="uppercase font-semibold">{
                  Math.ceil(
                    (
                      ((distanze.comitatoToOspedale.value + distanze.ospedaleToCasa.value) / 1000) > 15 // Se eccede i 15km
                        ? 46 + (((distanze.comitatoToOspedale.value + distanze.ospedaleToCasa.value) / 1000) - 15) * 0.95
                        : 46    // Tariffa base
                    )
                    +
                    (
                      ((distanze.casaToComitato.value / 1000) > 15 // Se eccede i 15km
                        ? 46 + ((distanze.casaToComitato.value / 1000) - 15) * 0.95
                        : 46
                      )
                    )
                    +
                    (
                      accompagnatore
                        ? 14
                        : 0
                    )
                  )
                } €</span>
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>

      </Card>}

    </div>
  );
}
