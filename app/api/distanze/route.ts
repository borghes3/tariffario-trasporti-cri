import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { ospedaleId, casaId } = await req.json();

  const origins = `place_id:${process.env.COMITATO_PLACE_ID}|place_id:${ospedaleId}|place_id:${casaId}`;
  const destinations = `place_id:${ospedaleId}|place_id:${casaId}|place_id:${process.env.COMITATO_PLACE_ID}`;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${process.env.GOOGLE_MAPS_API_KEY_BACKEND}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") {
    return NextResponse.json({ message: data.status }, { status: 500 });
  }

  try {
    const comitatoToOspedale = data.rows[0].elements[0];
    const ospedaleToCasa = data.rows[1].elements[1];
    const casaToComitato = data.rows[2].elements[2];

    console.log(JSON.stringify(data));

    if (comitatoToOspedale.status !== "OK" || ospedaleToCasa.status !== "OK" || casaToComitato.status !== "OK") {
      return NextResponse.json({ message: 'Errore nel calcolo di uno dei percorsi' }, { status: 500 });
    }

    const distances = {
      comitatoToOspedale: {
        text: comitatoToOspedale.distance.text,
        value: comitatoToOspedale.distance.value,
      },
      ospedaleToCasa: {
        text: ospedaleToCasa.distance.text,
        value: ospedaleToCasa.distance.value,
      },
      casaToComitato: {
        text: casaToComitato.distance.text,
        value: casaToComitato.distance.value,
      },
    };

    console.log(distances);

    return NextResponse.json(distances);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Errore nel calcolo del percorso' }, { status: 500 });
  }
}
