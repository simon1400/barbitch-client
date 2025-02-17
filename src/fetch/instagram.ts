import { google } from 'googleapis'

export const fetchIg = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
      private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\\n/g, '\n'),
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

  const sheetName = 'posts'
  const column = 'A'

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!${column}:${column}`,
  })

  const values = response.data.values

  if (!values || values.length === 0) {
    console.log('Лист пуст')
    return
  }

  const lastRow = values.length
  const startRow = Math.max(1, lastRow - 5)

  const dynamicRange = `${sheetName}!A${startRow}:D${lastRow}`

  const dataResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: dynamicRange,
  })

  const value = dataResponse.data.values || []

  const data: IInstagramItem[] = value.map((item) => ({
    type: item[0],
    previewUrl: item[0] === 'VIDEO' ? item[1] : item[2],
    permalink: item[3],
  }))

  return data
}
