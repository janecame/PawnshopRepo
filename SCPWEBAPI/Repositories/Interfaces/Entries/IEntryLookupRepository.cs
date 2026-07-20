namespace SCPWEBAPI.Repositories.Interfaces.Entries
{
    // Shared contract for the "code + description" lookup tables (tblEntryColor, tblEntryKarat, etc.)
    public interface IEntryLookupRepository<T>
    {
        IEnumerable<T> GetAll(string cnCode);
        void Insert(T entity);
        void Update(string cnCode, string code, T entity);
    }
}
