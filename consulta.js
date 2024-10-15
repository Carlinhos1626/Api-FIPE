import { load } from 'cheerio';

/**
 * @param {string} placa
 * @returns {Object}
 */

export async function consultarPlaca(placa) {
    const req = await fetch(`https://www.tabelafipebrasil.com/placa?placa=${placa}`, {
        headers: {
            "sec-ch-ua": "\"Brave\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "upgrade-insecure-requests": "1",
            "Referer": "https://www.tabelafipebrasil.com/placa",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "GET"
    });

    const res = await req.text();
    const $ = load(res);

    const table1 = $('.fipeTablePriceDetail');
    const data1 = {};

    table1.find('tr').each((index, element) => {
        const key = $(element).find('td').first().text().replace(':', '').trim();
        const value = $(element).find('td').last().text().trim();
        data1[key] = value;
    });

    const table2 = $('.fipe-desktop');

    table2.find('tr').each((index, element) => {
        if (index === 0) return; 
        const row = {};
        $(element).find('td').each((i, td) => {
            const text = $(td).text().trim();
            if (i === 0) row['Código FIPE'] = text;
            if (i === 1) row['Modelo'] = text;
            if (i === 2) row['Valor'] = text;
        });

        data1['Fipe'] = row;
    });

    if (Object.keys(data1).length === 0) {
        return { error: "Placa não encontrada." }
    }

    return data1;
}
