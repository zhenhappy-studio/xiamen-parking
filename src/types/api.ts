export type Parking = {
  id: number
  name: string
  address: string
  table: Array<Array<string>>
  qrcode: string | null
  updatedAt: Date
  createdAt: Date
}

// 基础响应类型
export interface ErrorResponse {
  error: string
}

// GET /parking 接口返回类型
export type GetParkingsResponse = Parking[]

// GET /parking/:id 接口返回类型
export type GetParkingResponse = Parking

// POST /parking 接口返回类型
export type CreateParkingResponse = Parking

// PUT /parking/:id 接口返回类型
export type UpdateParkingResponse = Parking

// DELETE /parking/:id 接口返回类型
// 注意：这个接口返回204无内容
export type DeleteParkingResponse = void
