export enum ModalName {
  CreateFeed = 'create-feed',
  CreateFolder = 'create-folder',
  MoveFeed = 'move-feed',
}

export type ModalData = {
  [ModalName.CreateFeed]: undefined;
  [ModalName.CreateFolder]: undefined;
  [ModalName.MoveFeed]: { feed_uuid: string };
};
