import { User } from './user.entity';
import { Cluster } from './cluster.entity';
import { Note } from './note.entity';
import { ClusterCollaborator } from './cluster_collaborator.entity';

const entities = [User, Cluster, Note, ClusterCollaborator];

export { User, Cluster, Note, ClusterCollaborator };

export default entities;
