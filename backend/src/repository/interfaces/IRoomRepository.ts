export interface IRoomRepository {
  isExistsRoomId(roomId: string): Promise<boolean>;
}
