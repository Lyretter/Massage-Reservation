export async function apiCall<T>(
  method: string,
  path: string,
  body?: object,
  token?: string
): Promise<{ ok: boolean; data: T }> {
  try {
    const res = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
    const data: T = await res.json()
    return { ok: res.ok, data }
  } catch (err) {
    console.error('[API Error]', err)
    return { ok: false, data: { msg: 'ไม่สามารถเชื่อมต่อ backend ได้' } as T }
  }
}
