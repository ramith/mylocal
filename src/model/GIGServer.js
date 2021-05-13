import Server from '../model/Server.js';

export default class GIGServer extends Server {

  static async getEntity(entityName, entityID) {
    return await Server.run(
      'gig',
      'entity',
      [entityName, entityID],
    );
  }

  static async getEntityIDs(entityName) {
    return await Server.run(
      'gig',
      'entity_ids',
      [entityName],
    );
  }

  static async getNearby([lat, lng]) {
    return (await Server.run(
      'gig',
      'nearby',
      [`${lat},${lng}`],
    ))['nearby_entity_info_list'];
  }
}
