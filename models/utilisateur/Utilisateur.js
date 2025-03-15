const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema({
    personne: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Personne', 
        required: true 
    },
    motDePasse: { 
        type: String, 
        required: true 
    },
    matricule: { 
        type: String,
        type: String
    },
    dateInscription: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    idRole: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role', 
        required: true 
    },
    dateEmbauche: { 
        type: Date 
    },
    etat: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

UtilisateurSchema.index({ matricule: 1 }, { unique: true, sparse: true });

async function getNextSequenceValue(role) {
    const counter = await mongoose.connection.db.collection('counters').findOneAndUpdate(
        {_id: `matricule_${role}`},
        {$inc: {seq: 1}},
        {upsert: true, returnDocument: 'after'}
    );
    return counter.value ? counter.value.seq : 1;
}

UtilisateurSchema.pre('save', async function (next) {
    const Role = mongoose.model('Role');
    try {
        const role = await Role.findById(this.idRole);

        if (role.libelle === 'mecanicien' || role.libelle === 'manager') {
            if (!this.matricule) {
                let prefix;
                if (role.libelle === 'mecanicien') {
                    prefix = 'MEC';
                } else {
                    prefix = 'MNG';
                }

                const sequence = await getNextSequenceValue(role.libelle);
                this.matricule = `${prefix}${String(sequence).padStart(3, '0')}`;
            }
        }
        next();
    } catch (error) {
        console.error('Error generating matricule:', error);
        return next(error);
    }
});

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);